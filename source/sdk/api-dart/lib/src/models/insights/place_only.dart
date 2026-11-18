import 'package:json_annotation/json_annotation.dart';

part 'place_only.g.dart';

/// Place Only
@JsonSerializable(includeIfNull: false)
class InsightsPlaceOnly {
  const InsightsPlaceOnly({required this.featureId});
  final String featureId;

  factory InsightsPlaceOnly.fromJson(Map<String, dynamic> json) => _$InsightsPlaceOnlyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceOnlyToJson(this);
}
