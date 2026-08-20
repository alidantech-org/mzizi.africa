"""
Analytics Helper - Helper class for processing analytics data
"""

from typing import Dict, Any, List
from datetime import datetime


class AnalyticsHelper:
    """Helper class for processing analytics data into chart-ready formats"""

    @staticmethod
    def parse_size_range(size_range: str) -> Dict[str, int]:
        """Parse size range string into min/max bytes"""
        size_mapping = {
            "0-1MB": {"min": 0, "max": 1024 * 1024},
            "1-10MB": {"min": 1024 * 1024, "max": 10 * 1024 * 1024},
            "10-50MB": {"min": 10 * 1024 * 1024, "max": 50 * 1024 * 1024},
            "50-100MB": {"min": 50 * 1024 * 1024, "max": 100 * 1024 * 1024},
            "100MB+": {"min": 100 * 1024 * 1024, "max": None},
        }
        return size_mapping.get(size_range, {})

    @staticmethod
    def _calculate_date_range_days(
        date_from: datetime = None, date_to: datetime = None
    ) -> int:
        """Calculate the number of days in the date range"""
        if not date_from and not date_to:
            return 365  # Default to 1 year if no date filter
        elif date_from and date_to:
            return (date_to - date_from).days
        elif date_from and not date_to:
            return (datetime.now() - date_from).days
        else:  # date_to but no date_from
            return 365  # Default to 1 year if only end date provided

    @staticmethod
    def _determine_growth_type(date_range_days: int) -> str:
        """Determine growth type based on date range"""
        if date_range_days <= 7:
            return "daily"
        elif date_range_days <= 31:
            return "weekly"
        else:
            return "monthly"

    @staticmethod
    def _process_monthly_data(
        raw_monthly: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Process monthly data for charts"""
        monthly_data = []
        for month_data in raw_monthly:
            monthly_data.append(
                {
                    "date": month_data.get("period"),
                    "uploads": month_data.get("upload_count", 0),
                    "downloads": month_data.get("download_count", 0),  # If tracked
                    "size": float(
                        round(month_data.get("total_size", 0) / (1024 * 1024), 2)
                    ),  # MB
                    "files": month_data.get("file_count", 0),
                    "storage": float(
                        round(month_data.get("cumulative_size", 0) / (1024 * 1024), 2)
                    ),  # MB
                }
            )
        return monthly_data

    @staticmethod
    def _process_weekly_data(raw_weekly: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process weekly data for charts"""
        weekly_data = []
        for week_data in raw_weekly:
            weekly_data.append(
                {
                    "date": week_data.get("period"),
                    "uploads": week_data.get("upload_count", 0),
                    "downloads": week_data.get("download_count", 0),  # If tracked
                    "size": float(
                        round(week_data.get("total_size", 0) / (1024 * 1024), 2)
                    ),  # MB
                    "files": week_data.get("file_count", 0),
                    "storage": float(
                        round(week_data.get("cumulative_size", 0) / (1024 * 1024), 2)
                    ),  # MB
                }
            )
        return weekly_data

    @staticmethod
    def _process_daily_data(raw_daily: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process daily data for charts"""
        daily_data = []
        for day_data in raw_daily:
            daily_data.append(
                {
                    "date": day_data.get("period"),
                    "uploads": day_data.get("upload_count", 0),
                    "downloads": day_data.get("download_count", 0),  # If tracked
                    "size": float(
                        round(day_data.get("total_size", 0) / (1024 * 1024), 2)
                    ),  # MB
                    "files": day_data.get("file_count", 0),
                    "storage": float(
                        round(day_data.get("cumulative_size", 0) / (1024 * 1024), 2)
                    ),  # MB
                }
            )
        return daily_data

    @staticmethod
    def _calculate_daily_growth_metrics(
        daily_data: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Calculate growth metrics from daily data"""
        growth_data = []
        for i in range(len(daily_data)):
            current = daily_data[i]
            prev = daily_data[i - 1] if i > 0 else None

            growth_entry = {
                "date": current.get("period", ""),  # Use period key instead of date
                "files": current.get("files", 0),
                "storage": current.get("storage", 0),
                "file_growth": 0,
                "storage_growth": 0,
                "file_growth_percent": 0,
                "storage_growth_percent": 0,
            }

            if prev:
                growth_entry["file_growth"] = current["files"] - prev["files"]
                growth_entry["storage_growth"] = current["storage"] - prev["storage"]

                if prev["files"] > 0:
                    growth_entry["file_growth_percent"] = round(
                        (growth_entry["file_growth"] / prev["files"]) * 100, 2
                    )
                if prev["storage"] > 0:
                    growth_entry["storage_growth_percent"] = round(
                        (growth_entry["storage_growth"] / prev["storage"]) * 100, 2
                    )

            growth_data.append(growth_entry)
        return growth_data

    @staticmethod
    def _calculate_weekly_growth_metrics(
        weekly_data: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Calculate growth metrics from weekly data"""
        growth_data = []
        for i in range(len(weekly_data)):
            current = weekly_data[i]
            prev = weekly_data[i - 1] if i > 0 else None

            growth_entry = {
                "date": current.get("period", ""),  # Use period key instead of date
                "files": current.get("files", 0),
                "storage": current.get("storage", 0),
                "file_growth": 0,
                "storage_growth": 0,
                "file_growth_percent": 0,
                "storage_growth_percent": 0,
            }

            if prev:
                growth_entry["file_growth"] = current["files"] - prev["files"]
                growth_entry["storage_growth"] = current["storage"] - prev["storage"]

                if prev["files"] > 0:
                    growth_entry["file_growth_percent"] = round(
                        (growth_entry["file_growth"] / prev["files"]) * 100, 2
                    )
                if prev["storage"] > 0:
                    growth_entry["storage_growth_percent"] = round(
                        (growth_entry["storage_growth"] / prev["storage"]) * 100, 2
                    )

            growth_data.append(growth_entry)
        return growth_data

    @staticmethod
    def _calculate_monthly_growth_metrics(
        monthly_data: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Calculate growth metrics from monthly data"""
        growth_data = []
        for i in range(len(monthly_data)):
            current = monthly_data[i]
            prev = monthly_data[i - 1] if i > 0 else None

            growth_entry = {
                "date": current.get("period", ""),  # Use period key instead of date
                "files": current.get("files", 0),
                "storage": current.get("storage", 0),
                "file_growth": 0,
                "storage_growth": 0,
                "file_growth_percent": 0,
                "storage_growth_percent": 0,
            }

            if prev:
                growth_entry["file_growth"] = current["files"] - prev["files"]
                growth_entry["storage_growth"] = current["storage"] - prev["storage"]

                if prev["files"] > 0:
                    growth_entry["file_growth_percent"] = round(
                        (growth_entry["file_growth"] / prev["files"]) * 100, 2
                    )
                if prev["storage"] > 0:
                    growth_entry["storage_growth_percent"] = round(
                        (growth_entry["storage_growth"] / prev["storage"]) * 100, 2
                    )

            growth_data.append(growth_entry)

        return growth_data

    @staticmethod
    def _calculate_growth_metrics(
        monthly_data: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Calculate growth metrics from monthly data"""
        growth_data = []
        if len(monthly_data) > 1:
            for i in range(len(monthly_data)):
                current = monthly_data[i]
                prev = monthly_data[i - 1] if i > 0 else None

                growth_entry = {
                    "date": current["date"],
                    "files": current["files"],
                    "storage": current["storage"],
                    "file_growth": 0,
                    "storage_growth": 0,
                    "file_growth_percent": 0,
                    "storage_growth_percent": 0,
                }

                if prev:
                    growth_entry["file_growth"] = current["files"] - prev["files"]
                    growth_entry["storage_growth"] = (
                        current["storage"] - prev["storage"]
                    )

                    if prev["files"] > 0:
                        growth_entry["file_growth_percent"] = round(
                            (growth_entry["file_growth"] / prev["files"]) * 100, 2
                        )
                    if prev["storage"] > 0:
                        growth_entry["storage_growth_percent"] = round(
                            (growth_entry["storage_growth"] / prev["storage"]) * 100, 2
                        )

    @staticmethod
    def _calculate_monthly_growth_metrics(
        monthly_data: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Calculate growth metrics from monthly data"""
        growth_data = []
        if len(monthly_data) > 1:
            for i in range(len(monthly_data)):
                current = monthly_data[i]
                prev = monthly_data[i - 1] if i > 0 else None

                growth_entry = {
                    "date": current["date"],
                    "files": current["files"],
                    "storage": current["storage"],
                    "file_growth": 0,
                    "storage_growth": 0,
                    "file_growth_percent": 0,
                    "storage_growth_percent": 0,
                }

                if prev:
                    growth_entry["file_growth"] = current["files"] - prev["files"]
                    growth_entry["storage_growth"] = (
                        current["storage"] - prev["storage"]
                    )

                    if prev["files"] > 0:
                        growth_entry["file_growth_percent"] = round(
                            (growth_entry["file_growth"] / prev["files"]) * 100, 2
                        )
                    if prev["storage"] > 0:
                        growth_entry["storage_growth_percent"] = round(
                            (growth_entry["storage_growth"] / prev["storage"]) * 100, 2
                        )

                    growth_data.append(growth_entry)

            return growth_data

    @staticmethod
    def _calculate_yearly_growth_metrics(
        yearly_data: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Calculate growth metrics from yearly data"""
        growth_data = []
        for i in range(len(yearly_data)):
            current = yearly_data[i]
            prev = yearly_data[i - 1] if i > 0 else None

            growth_entry = {
                "date": current.get("period", ""),  # Use period key instead of date
                "files": current.get("files", 0),
                "storage": current.get("storage", 0),
                "file_growth": 0,
                "storage_growth": 0,
                "file_growth_percent": 0,
                "storage_growth_percent": 0,
            }

            if prev:
                growth_entry["file_growth"] = current["files"] - prev["files"]
                growth_entry["storage_growth"] = current["storage"] - prev["storage"]

                if prev["files"] > 0:
                    growth_entry["file_growth_percent"] = round(
                        (growth_entry["file_growth"] / prev["files"]) * 100, 2
                    )
                if prev["storage"] > 0:
                    growth_entry["storage_growth_percent"] = round(
                        (growth_entry["storage_growth"] / prev["storage"]) * 100, 2
                    )

            growth_data.append(growth_entry)

        return growth_data

    @staticmethod
    def build_analytics_response(analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Build comprehensive analytics response"""
        return {
            "summary": {
                "total_files": analytics_data.get("total_files", 0),
                "total_size": analytics_data.get("total_size", 0),
                "total_size_mb": round(
                    analytics_data.get("total_size", 0) / (1024 * 1024), 2
                ),
                "total_size_gb": round(
                    analytics_data.get("total_size", 0) / (1024 * 1024 * 1024), 2
                ),
                "avg_file_size": analytics_data.get("avg_file_size", 0),
                "avg_file_size_mb": round(
                    analytics_data.get("avg_file_size", 0) / (1024 * 1024), 2
                ),
                "total_folders": analytics_data.get("total_folders", 0),
            },
            "file_type_distribution": analytics_data.get("file_type_distribution", []),
            "folder_distribution": analytics_data.get("folder_distribution", []),
            "size_distribution": analytics_data.get("size_distribution", []),
            "growth_metrics": {
                "monthly": analytics_data.get("monthly_data", []),
                "weekly": analytics_data.get("weekly_data", []),
                "daily": analytics_data.get("daily_data", []),
                "yearly": analytics_data.get("yearly_data", []),
            },
        }

    @staticmethod
    def build_cache_key(
        file_type: str = None,
        folder: str = None,
        size_range: str = None,
        date_from: datetime = None,
        date_to: datetime = None,
    ) -> str:
        """Build cache key for analytics"""
        return f"file_analytics:{file_type}:{folder}:{size_range}:{date_from}:{date_to}"

    @staticmethod
    def convert_uuid_strings_to_objects(data: Dict[str, Any]):
        """Convert UUID strings in cached data back to UUID objects"""
        from uuid import UUID

        if isinstance(data, dict):
            for key, value in data.items():
                if key in ["id", "directory_id", "file_type_code"] and isinstance(
                    value, str
                ):
                    try:
                        data[key] = UUID(value)
                    except (ValueError, AttributeError):
                        pass  # Keep as string if invalid UUID
                elif isinstance(value, (dict, list)):
                    AnalyticsHelper.convert_uuid_strings_to_objects(value)
