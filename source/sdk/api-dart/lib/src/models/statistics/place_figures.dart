import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'place_figures.g.dart';

/// Place Figures
@JsonSerializable(includeIfNull: false)
class StatisticsPlaceFigures {
  const StatisticsPlaceFigures({required this.countryId, required this.featureId, this.indicatorId, this.limit, this.offset});
  final String countryId;
  final String featureId;
  final String? indicatorId;
  final int? limit;
  final int? offset;

  factory StatisticsPlaceFigures.fromJson(Map<String, dynamic> json) => _$StatisticsPlaceFiguresFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsPlaceFiguresToJson(this);
}
