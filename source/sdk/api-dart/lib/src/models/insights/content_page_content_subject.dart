import 'package:json_annotation/json_annotation.dart';

part 'content_page_content_subject.g.dart';

/// Content Page Content Subject
@JsonSerializable(includeIfNull: false)
class InsightsContentPageContentSubject {
  const InsightsContentPageContentSubject({required this.code, required this.table});
  final String code;
  final String table;

  factory InsightsContentPageContentSubject.fromJson(Map<String, dynamic> json) => _$InsightsContentPageContentSubjectFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageContentSubjectToJson(this);
}
