import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_content_subject.g.dart';

/// Institution Detail Content Subject
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailContentSubject {
  const InsightsInstitutionDetailContentSubject({required this.code, required this.table});
  final String code;
  final String table;

  factory InsightsInstitutionDetailContentSubject.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailContentSubjectFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailContentSubjectToJson(this);
}
