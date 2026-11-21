import 'package:json_annotation/json_annotation.dart';

part 'place_at.g.dart';

/// Place At
@JsonSerializable(includeIfNull: false)
class InsightsPlaceAt {
  const InsightsPlaceAt({required this.countryCode, this.languageCode, this.path});
  final String countryCode;
  final String? languageCode;
  final String? path;

  factory InsightsPlaceAt.fromJson(Map<String, dynamic> json) => _$InsightsPlaceAtFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceAtToJson(this);
}
