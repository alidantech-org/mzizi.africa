import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/statistics/indicators.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'components.g.dart';

/// One part of a composite index, with its weight and transform.
@JsonSerializable(includeIfNull: false)
class StatisticsComponents {
  const StatisticsComponents({
    required this.componentId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.indicatorId,
    this.position,
    required this.transformTerm,
    required this.weight,
  });
  final String componentId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String indicatorId;
  final int? position;
  final String transformTerm;
  final double weight;

  factory StatisticsComponents.fromJson(Map<String, dynamic> json) => _$StatisticsComponentsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsComponentsToJson(this);
}
