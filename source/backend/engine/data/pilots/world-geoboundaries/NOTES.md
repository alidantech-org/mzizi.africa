# Notes: geoBoundaries release catalogue (pilot structure, API)

The geoBoundaries API (`/api/current/gbOpen/<ISO3>/<ADM level>/`) returns one JSON object per release with `boundaryName`, `boundaryLicense`, `boundarySource`, `buildDate`, `gjDownloadURL` and `simplifiedGeometryGeoJSON`. The example is the real response saved on 2026-11-02 for KEN ADM1 (also used by the vertical slice). Using the API is the preferred route in the intake plan.

This module reads one release (Kenya ADM1) as a catalogue record of the dataset document; the GeoJSON itself is fetched and extracted by the dataset import path (`mzizi-data import-geoboundaries`), not by this structure. The licence comes from each release's own metadata (`Public Domain` for Kenya, which a human has not confirmed); other countries and levels need their own module or URL variables (`${iso3}`, `${level}`) once the structure runner supports looping over a value list.

Gaps: no loop over countries and levels; the site is not Kenyan (it supplies Kenyan data, so it is listed as a world site); robots.txt and terms were not read.

Technically valid only: collection stays blocked until an approved assessment exists.
