import 'package:json_annotation/json_annotation.dart';

part 'legal_basis_input.g.dart';

/// Legal Basis Input
@JsonSerializable(includeIfNull: false)
class InsightsLegalBasisInput {
  const InsightsLegalBasisInput({required this.subjectCode, required this.subjectTable});
  final String subjectCode;
  final String subjectTable;

  factory InsightsLegalBasisInput.fromJson(Map<String, dynamic> json) => _$InsightsLegalBasisInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLegalBasisInputToJson(this);
}
