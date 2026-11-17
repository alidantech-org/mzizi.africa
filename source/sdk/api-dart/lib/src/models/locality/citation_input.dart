import 'package:json_annotation/json_annotation.dart';

part 'citation_input.g.dart';

/// Citation Input
@JsonSerializable(includeIfNull: false)
class LocalityCitationInput {
  const LocalityCitationInput({required this.citationId});
  final String citationId;

  factory LocalityCitationInput.fromJson(Map<String, dynamic> json) => _$LocalityCitationInputFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityCitationInputToJson(this);
}
