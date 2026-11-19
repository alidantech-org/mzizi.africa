import 'package:json_annotation/json_annotation.dart';

part 'content_list_items_subject.g.dart';

/// Content List Items Subject
@JsonSerializable(includeIfNull: false)
class InsightsContentListItemsSubject {
  const InsightsContentListItemsSubject({this.code, required this.table});
  final String? code;
  final String table;

  factory InsightsContentListItemsSubject.fromJson(Map<String, dynamic> json) => _$InsightsContentListItemsSubjectFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListItemsSubjectToJson(this);
}
