import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';
import 'package:mzizi_api/src/models/statistics/observations.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'breakdowns.g.dart';

/// The categories that cut one observation: at most one term per dimension.
@JsonSerializable(includeIfNull: false)
class StatisticsBreakdowns {
  const StatisticsBreakdowns({
    required this.countryId,
    required this.createdAt,
    required this.id,
    required this.observationId,
    required this.schemeId,
    required this.termId,
  });
  final String countryId;
  final DateTime createdAt;
  final String id;
  final String observationId;
  final String schemeId;
  final String termId;

  factory StatisticsBreakdowns.fromJson(Map<String, dynamic> json) => _$StatisticsBreakdownsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsBreakdownsToJson(this);
}
