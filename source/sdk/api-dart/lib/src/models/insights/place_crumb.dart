import 'package:json_annotation/json_annotation.dart';

part 'place_crumb.g.dart';

/// Place Crumb
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCrumb {
  const InsightsPlaceCrumb({required this.featureId, required this.kindCode, required this.kindLabel, required this.name, this.path});
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String? path;

  factory InsightsPlaceCrumb.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCrumbFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCrumbToJson(this);
}
