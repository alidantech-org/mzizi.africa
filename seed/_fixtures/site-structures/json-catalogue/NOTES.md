# Notes: example open-data catalogue (sample, fictional host)

A CKAN-style package_search response is assumed: `$.result.results[*]` holds datasets with `title`, `url` and `metadata_modified`. Using an API is the preferred route in the intake plan; no HTML is parsed.

Gaps: pagination via `start` and `rows` is not modelled yet; the sample takes the first 100 datasets. Resource downloads (the files inside a dataset) need a second module. The licence is declared as CC-BY 4.0 for the sample only; a real catalogue has a licence per dataset, which a real bundle must read from the response.

Technically valid does not mean approved: the collection gate still requires a current approved assessment.
