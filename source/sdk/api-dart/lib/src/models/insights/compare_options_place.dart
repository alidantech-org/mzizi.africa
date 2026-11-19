import 'package:json_annotation/json_annotation.dart';

part 'compare_options_place.g.dart';

/// Compare Options Place
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsPlace {
  const InsightsCompareOptionsPlace({
    required this.featureId,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
    required this.path,
  });
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String path;

  factory InsightsCompareOptionsPlace.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsPlaceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsPlaceToJson(this);
}
