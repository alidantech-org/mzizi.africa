# Web vocabulary

`vocabulary.v1.yaml` is the classification data the web layer reads: file extensions by URL kind, tracking query parameters, access-challenge markers, file signatures and the default response to each block kind. `vocabulary.schema.json` is generated from the typed model `mzizi_fetch.web.vocabulary.Vocabulary` (a test keeps them in sync). Change behaviour here, not in code. Override the file with `MZIZI_WEB_VOCABULARY`.
