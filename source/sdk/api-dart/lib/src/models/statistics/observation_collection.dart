import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/statistics/observation_entry.dart';

part 'observation_collection.g.dart';

/// Observation Collection
@JsonSerializable(includeIfNull: false)
class StatisticsObservationCollection {
  const StatisticsObservationCollection({required this.observations});
  final List<StatisticsObservationEntry> observations;

  factory StatisticsObservationCollection.fromJson(Map<String, dynamic> json) => _$StatisticsObservationCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsObservationCollectionToJson(this);
}
