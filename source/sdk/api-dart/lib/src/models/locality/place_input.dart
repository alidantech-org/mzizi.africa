import 'package:json_annotation/json_annotation.dart';

part 'place_input.g.dart';

/// Place Input
@JsonSerializable(includeIfNull: false)
class LocalityPlaceInput {
  const LocalityPlaceInput({required this.featureId, this.languageCode, this.onDate});
  final String featureId;
  final String? languageCode;
  final DateTime? onDate;

  factory LocalityPlaceInput.fromJson(Map<String, dynamic> json) => _$LocalityPlaceInputFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityPlaceInputToJson(this);
}
