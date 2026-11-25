import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/statistics/indicator_figure_entry.dart';

part 'indicator_figure_collection.g.dart';

/// Indicator Figure Collection
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorFigureCollection {
  const StatisticsIndicatorFigureCollection({required this.figures});
  final List<StatisticsIndicatorFigureEntry> figures;

  factory StatisticsIndicatorFigureCollection.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorFigureCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorFigureCollectionToJson(this);
}
