import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'observation_scope.g.dart';

/// Observation Scope
@JsonSerializable(includeIfNull: false)
class StatisticsObservationScope {
  const StatisticsObservationScope({required this.countryId, required this.featureId, required this.indicatorId, this.limit, this.offset});
  final String countryId;
  final String featureId;
  final String indicatorId;
  final int? limit;
  final int? offset;

  factory StatisticsObservationScope.fromJson(Map<String, dynamic> json) => _$StatisticsObservationScopeFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsObservationScopeToJson(this);
}
