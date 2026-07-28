# LinkedIn V4 Blind-Code Inter-Run Consistency

**Status:** FAIL
**Interpretation:** two independent model passes; not human validity
**Structural issues:** 0
**Provenance issues:** 3

- `coder_a_codebook_sha_mismatch`
- `coder_b_input_sha_missing`
- `coder_b_codebook_sha_missing`

| Phase | Items | Overall exact | Required | Lowest field | AC1 fields pass | Result |
|---|---:|---:|---:|---:|---|---|
| Calibration | 16 | 89.2% | 85.0% | 68.8% | no | FAIL |
| Holdout | 12 | 89.8% | 90.0% | 66.7% | no | FAIL |

| Phase | Field | Exact agreement | Gwet AC1 | Categories |
|---|---|---:|---:|---:|
| calibration | audience_specificity | 75.0% | 0.695 | 5 |
| calibration | entry_hook | 93.8% | 0.929 | 8 |
| calibration | job_promised | 100.0% | 1.000 | 8 |
| calibration | primary_proof | 81.3% | 0.784 | 7 |
| calibration | primary_artifact | 68.8% | 0.645 | 6 |
| calibration | platform_format | 100.0% | 1.000 | 3 |
| calibration | primary_cta | 87.5% | 0.847 | 5 |
| calibration | content_class | 81.3% | 0.778 | 6 |
| calibration | problem_family | 93.8% | 0.928 | 7 |
| calibration | OC_INPUTS | 87.5% | 0.820 | 2 |
| calibration | OC_STEPS | 87.5% | 0.750 | 2 |
| calibration | OC_OUTPUT | 87.5% | 0.820 | 2 |
| calibration | OC_VALIDATION | 87.5% | 0.750 | 2 |
| calibration | DD_NEWS | 93.8% | 0.895 | 2 |
| calibration | DD_PROMOTION | 93.8% | 0.879 | 2 |
| calibration | DD_PERSONAL_AUTHORITY | 93.8% | 0.879 | 2 |
| calibration | DD_COMMENT_GATE | 100.0% | NA | 1 |
| calibration | DD_EVERGREEN | 93.8% | 0.879 | 2 |
| holdout | audience_specificity | 66.7% | 0.564 | 4 |
| holdout | entry_hook | 83.3% | 0.811 | 8 |
| holdout | job_promised | 91.7% | 0.902 | 6 |
| holdout | primary_proof | 91.7% | 0.898 | 5 |
| holdout | primary_artifact | 83.3% | 0.806 | 6 |
| holdout | platform_format | 100.0% | 1.000 | 2 |
| holdout | primary_cta | 91.7% | 0.900 | 5 |
| holdout | content_class | 83.3% | 0.807 | 7 |
| holdout | problem_family | 100.0% | 1.000 | 7 |
| holdout | OC_INPUTS | 100.0% | 1.000 | 2 |
| holdout | OC_STEPS | 91.7% | 0.835 | 2 |
| holdout | OC_OUTPUT | 91.7% | 0.858 | 2 |
| holdout | OC_VALIDATION | 91.7% | 0.835 | 2 |
| holdout | DD_NEWS | 100.0% | 1.000 | 2 |
| holdout | DD_PROMOTION | 83.3% | 0.700 | 2 |
| holdout | DD_PERSONAL_AUTHORITY | 83.3% | 0.733 | 2 |
| holdout | DD_COMMENT_GATE | 100.0% | NA | 1 |
| holdout | DD_EVERGREEN | 83.3% | 0.676 | 2 |

**Decision:** Do not freeze the meaning-heavy taxonomy. Revise/adjudicate failed fields before using them as decision-grade evidence. Reliability provenance is incomplete; no exact-final-codebook claim is permitted.

**Excluded module:** Primary visual structure and visual descriptors were not evaluated because the blind input exposed only native-format summaries.
