import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/statistics/figure_entry.dart';

part 'figure_collection.g.dart';

/// Figure Collection
@JsonSerializable(includeIfNull: false)
class StatisticsFigureCollection {
  const StatisticsFigureCollection({required this.figures});
  final List<StatisticsFigureEntry> figures;

  factory StatisticsFigureCollection.fromJson(Map<String, dynamic> json) => _$StatisticsFigureCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsFigureCollectionToJson(this);
}
