import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_institution_basis.g.dart';

/// Institution Detail Institution Basis
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailInstitutionBasis {
  const InsightsInstitutionDetailInstitutionBasis({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailInstitutionBasis.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailInstitutionBasisFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailInstitutionBasisToJson(this);
}
