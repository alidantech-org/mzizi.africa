import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/content_list_categories.dart';
import 'package:mzizi_api/src/models/insights/content_list_items.dart';

part 'content_list.g.dart';

/// Content List
@JsonSerializable(includeIfNull: false)
class InsightsContentList {
  const InsightsContentList({required this.categories, required this.gaps, required this.items});
  final List<InsightsContentListCategories> categories;
  final List<String> gaps;
  final List<InsightsContentListItems> items;

  factory InsightsContentList.fromJson(Map<String, dynamic> json) => _$InsightsContentListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListToJson(this);
}
