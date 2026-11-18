import 'package:json_annotation/json_annotation.dart';

part 'content_list.g.dart';

/// Content List
@JsonSerializable(includeIfNull: false)
class InsightsContentList {
  const InsightsContentList({required this.categories, required this.gaps, required this.items});
  final List<Object?> categories;
  final List<String> gaps;
  final List<Object?> items;

  factory InsightsContentList.fromJson(Map<String, dynamic> json) => _$InsightsContentListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListToJson(this);
}
