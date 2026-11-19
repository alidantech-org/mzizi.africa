import 'package:json_annotation/json_annotation.dart';

part 'content_page_related_subject.g.dart';

/// Content Page Related Subject
@JsonSerializable(includeIfNull: false)
class InsightsContentPageRelatedSubject {
  const InsightsContentPageRelatedSubject({required this.code, required this.table});
  final String code;
  final String table;

  factory InsightsContentPageRelatedSubject.fromJson(Map<String, dynamic> json) => _$InsightsContentPageRelatedSubjectFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageRelatedSubjectToJson(this);
}
