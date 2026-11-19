import 'package:json_annotation/json_annotation.dart';

part 'legal_basis_subject.g.dart';

/// Legal Basis Subject
@JsonSerializable(includeIfNull: false)
class InsightsLegalBasisSubject {
  const InsightsLegalBasisSubject({required this.code, required this.table});
  final String code;
  final String table;

  factory InsightsLegalBasisSubject.fromJson(Map<String, dynamic> json) => _$InsightsLegalBasisSubjectFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLegalBasisSubjectToJson(this);
}
