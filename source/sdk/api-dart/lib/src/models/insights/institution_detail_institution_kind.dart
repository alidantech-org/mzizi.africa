import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_institution_kind.g.dart';

/// Institution Detail Institution Kind
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailInstitutionKind {
  const InsightsInstitutionDetailInstitutionKind({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailInstitutionKind.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailInstitutionKindFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailInstitutionKindToJson(this);
}
