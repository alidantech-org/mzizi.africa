import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/statistics/indicators.dart';
import 'package:mzizi_api/src/models/vocabulary/schemes.dart';

part 'dimensions.g.dart';

/// Which breakdowns an indicator allows, in order.
@JsonSerializable(includeIfNull: false)
class StatisticsDimensions {
  const StatisticsDimensions({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.indicatorId,
    required this.isRequired,
    required this.position,
    required this.schemeId,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String indicatorId;
  final bool isRequired;
  final int position;
  final String schemeId;

  factory StatisticsDimensions.fromJson(Map<String, dynamic> json) => _$StatisticsDimensionsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsDimensionsToJson(this);
}
