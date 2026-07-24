# Research Notes - Forecast Value Add

**Research date:** 2026-07-16

## Load-Bearing Findings

1. Forecast Value Add evaluates the change in a chosen forecast performance metric that can be attributed to a process step or participant.
2. The comparison must preserve the forecast that existed before the override. Accuracy against actuals alone cannot show whether the override added value.
3. FVA can be positive or negative. This post declares an error-based sign convention: `FVA (pts) = baseline WAPE - adjusted WAPE`, so positive means the adjusted forecast reduced error.
4. A positive result is not automatically sufficient. The value may be too small, inconsistent, or expensive to justify the process effort.
5. The analysis needs matched item-location-period rows, comparable forecast horizons/vintages, actual demand, and a declared error metric.
6. ChatGPT can inspect structured spreadsheet files, calculate comparative metrics, produce review tables and charts, and work directly with Excel or Google Sheets. Exact formulas and changed cells still require review.

## Worked Example

The visual uses a synthetic example, not a claimed benchmark:

- Baseline WAPE: `18.2%`
- Human-adjusted WAPE: `12.7%`
- FVA: `18.2% - 12.7% = +5.5 percentage points`
- Interpretation: the override added value for this sample because it reduced the declared error metric.

Illustrative reason-code rows:

| Override reason | FVA | Review action |
|---|---:|---|
| Promotion | +8.1 pts | Keep |
| Customer event | +3.4 pts | Learn |
| No evidence | -6.2 pts | Stop |

These rows are deliberately illustrative. The published caption must not present them as external benchmarks.

## Sources

- SAS, Michael Gilliland, `Forecast Value Added Analysis: Step-by-Step`: https://www.sas.com/content/dam/SAS/documents/marketing-whitepapers-ebooks/sas-whitepapers/en/forecast-value-added-analysis-106186.pdf
- OpenAI Help Center, `Extracting Insights with ChatGPT Data Analysis`: https://help.openai.com/en/articles/9213685-extracting-insights-with-chatgpt-data-analysis
- OpenAI Help Center, `ChatGPT for Excel and Google Sheets`: https://help.openai.com/en/articles/20001063-chatgpt-for-excel/

## Claims To Avoid

- Do not claim that all human overrides reduce accuracy.
- Do not claim that one FVA result proves a permanent rule.
- Do not mix WAPE, MAPE, bias, or accuracy conventions without declaring the metric and sign.
- Do not let ChatGPT invent missing baseline versions or infer a matched horizon from unlabeled files.
- Do not let the visual imply that the AI approves a production forecast or writes to the planning system.
