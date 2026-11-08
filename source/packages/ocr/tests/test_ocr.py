import shutil

import pytest

from mzizi_ocr import OcrUnavailable, check, version


def test_a_missing_engine_is_a_clear_error_and_an_installed_one_reports_its_version():
    if shutil.which("tesseract"):
        assert version()
        assert check("eng")
    else:
        with pytest.raises(OcrUnavailable):
            check("eng")
