import 'package:json_annotation/json_annotation.dart';

part 'structure_input.g.dart';

/// Structure Input
@JsonSerializable(includeIfNull: false)
class StructureStructureInput {
  const StructureStructureInput({required this.countryCode});
  final String countryCode;

  factory StructureStructureInput.fromJson(Map<String, dynamic> json) => _$StructureStructureInputFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureInputToJson(this);
}
