import 'package:json_annotation/json_annotation.dart';

part 'map_input.g.dart';

/// Map Input
@JsonSerializable(includeIfNull: false)
class InsightsMapInput {
  const InsightsMapInput({required this.indicatorCode, this.kindCode, this.parentFeatureId});
  final String indicatorCode;
  final String? kindCode;
  final String? parentFeatureId;

  factory InsightsMapInput.fromJson(Map<String, dynamic> json) => _$InsightsMapInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMapInputToJson(this);
}
