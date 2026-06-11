# LP Demo Transcript and Bugs

## Quick Terms

```text
commissionPercent:
Percentage of sale price taken as commission.
Example: 0.06 means 6%.

agentSplitPercent:
Percentage of commission paid to the agent.
Example: 95 means agent gets 95%.

brokerageSplitPercent:
Percentage of commission kept by the brokerage.
Example: if agent gets 95, brokerage gets 5.

optimizationConstraints:
Input limits sent to the solver.
Example: commission must stay between 1.5% and 6%.

decision variables:
Values the LP solver is allowed to choose.
Here they are commissionPercent, agentSplitPercent, and brokerageSplitPercent.

objective:
The goal the solver tries to maximize.
Here the default goal is maximizeAgentEarnings.

LP solver:
The library that calculates the best values inside the given limits.

OptimizationProblemDto:
Backend object created from request input and passed to the solver.
```

## Bug 1: Hardcoded Deductions in LP Response

Status:

```text
Found
```

Where to look:

```text
src/optimization/optimization.service.ts
solveUsingLinearProgramming()
```

Problem code:

```ts
preSplitDeductions: [
  { name: 'Referral Fee', type: 'percentage', value: 0.02 },
  { name: 'Lead Fee', type: 'fixed', value: 500 },
],
postSplitDeductions: [
  { name: 'Transaction Coordinator Fees', type: 'fixed', value: 300 },
  { name: 'E&O Insurance', type: 'percentage', value: 0.01 },
],
brokerageMiscExpenses: [
  { name: 'Brokerage Yearly Fee', type: 'fixed', value: 1000 },
],
```

What I observed:

```text
Request sent E&O Insurance value as 0.005.
Response returned E&O Insurance value as 0.01.
```

Bug:

```text
The LP API ignores request deductions and returns hardcoded deduction values.
```

Impact:

```text
Frontend can show fees the user did not send.
The optimized response becomes misleading.
Any exported or explained result may contain wrong deduction data.
```

Expected fix:

```ts
preSplitDeductions: input.pre_split_deductions,
postSplitDeductions: input.post_split_deductions,
brokerageMiscExpenses: input.brokerage_misc_expenses,
```

Transcript:

```text
The first bug I found is in the LP response.

The request sends deduction values, but the backend returns hardcoded deductions.

For example, I sent E&O Insurance as 0.005, but the response returned 0.01.

This can cause the frontend to show values the user never selected.

The fix is to pass the original input into the LP function and return the request deductions instead of static defaults.
```

## Bug 2: Missing Constraint Range Validation

Status:

```text
Found
```

Where to look:

```text
src/optimization/optimization.service.ts
validateOptimizationProblem()
```

Current validation:

```ts
if (constraints.minAgentSplitPercent > constraints.maxAgentSplitPercent) {
  throw new BadRequestException(
    'minAgentSplitPercent cannot exceed maxAgentSplitPercent',
  );
}
```

Bug:

```text
The API checks min greater than max, but it does not validate the actual allowed range.
```

Bad input that can pass:

```json
{
  "minAgentSplitPercent": 60,
  "maxAgentSplitPercent": 120
}
```

Possible bad output:

```json
{
  "agentSplitPercent": 120,
  "brokerageSplitPercent": -20
}
```

Impact:

```text
Frontend can display impossible commission splits.
Agent split above 100 or brokerage split below 0 is invalid business data.
```

Expected fix:

```text
Validate agent split is between 0 and 100.
Validate brokerage split cannot become negative.
Validate commission percent is not negative.
```

Transcript:

```text
The second bug is missing range validation.

The backend checks if minimum is greater than maximum, but it does not check whether the values are valid business percentages.

For example, maxAgentSplitPercent can be 120.

That can produce an impossible result like agent split 120 and brokerage split negative 20.

The fix is to validate percentage ranges before sending the problem to the LP solver.
```

## Bug 3: Unsafe Fallback Defaults Using ||

Status:

```text
Found
```

Where to look:

```text
src/optimization/optimization.service.ts
solveUsingLinearProgramming()
```

Problem code:

```ts
const agentSplit = results.agentSplitPercent || 80;

return {
  commissionPercent: results.commissionPercent || 0.06,
  agentSplitPercent: agentSplit,
};
```

Bug:

```text
The code uses || for fallback values.
```

Why this is risky:

```text
In JavaScript, 0 is treated as false.
If the solver returns 0 as a valid value, the backend replaces it with the default.
```

Example input:

```json
{
  "minCommissionPercent": 0,
  "maxCommissionPercent": 0,
  "minAgentSplitPercent": 0,
  "maxAgentSplitPercent": 0
}
```

Expected:

```text
commissionPercent = 0
agentSplitPercent = 0
```

Risky fallback result:

```text
commissionPercent = 0.06
agentSplitPercent = 80
```

Impact:

```text
API can return values outside the user's requested constraints.
Frontend can show an optimized result that violates the input rules.
```

Expected fix:

```ts
const agentSplit = results.agentSplitPercent ?? 80;

return {
  commissionPercent: results.commissionPercent ?? 0.06,
  agentSplitPercent: agentSplit,
};
```