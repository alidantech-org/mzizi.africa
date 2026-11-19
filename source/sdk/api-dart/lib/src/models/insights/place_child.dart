import 'package:json_annotation/json_annotation.dart';

part 'place_child.g.dart';

/// Place Child
@JsonSerializable(includeIfNull: false)
class InsightsPlaceChild {
  const InsightsPlaceChild({
    required this.childCount,
    required this.featureId,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
    this.path,
    this.population,
  });
  final int childCount;
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String? path;
  final double? population;

  factory InsightsPlaceChild.fromJson(Map<String, dynamic> json) => _$InsightsPlaceChildFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceChildToJson(this);
}
