import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/statistics/indicator_entry.dart';

part 'indicator_collection.g.dart';

/// Indicator Collection
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorCollection {
  const StatisticsIndicatorCollection({required this.indicators});
  final List<StatisticsIndicatorEntry> indicators;

  factory StatisticsIndicatorCollection.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorCollectionToJson(this);
}
