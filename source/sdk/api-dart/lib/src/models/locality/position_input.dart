import 'package:json_annotation/json_annotation.dart';

part 'position_input.g.dart';

/// Position Input
@JsonSerializable(includeIfNull: false)
class LocalityPositionInput {
  const LocalityPositionInput({this.languageCode, required this.latitude, required this.longitude, this.onDate});
  final String? languageCode;
  final double latitude;
  final double longitude;
  final DateTime? onDate;

  factory LocalityPositionInput.fromJson(Map<String, dynamic> json) => _$LocalityPositionInputFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityPositionInputToJson(this);
}
