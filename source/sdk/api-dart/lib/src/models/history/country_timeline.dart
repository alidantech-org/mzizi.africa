import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'country_timeline.g.dart';

/// Country Timeline
@JsonSerializable(includeIfNull: false)
class HistoryCountryTimeline {
  const HistoryCountryTimeline({required this.countryId, this.limit, this.offset});
  final String countryId;
  final int? limit;
  final int? offset;

  factory HistoryCountryTimeline.fromJson(Map<String, dynamic> json) => _$HistoryCountryTimelineFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryCountryTimelineToJson(this);
}
