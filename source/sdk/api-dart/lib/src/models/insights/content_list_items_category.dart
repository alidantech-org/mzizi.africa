import 'package:json_annotation/json_annotation.dart';

part 'content_list_items_category.g.dart';

/// Content List Items Category
@JsonSerializable(includeIfNull: false)
class InsightsContentListItemsCategory {
  const InsightsContentListItemsCategory({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsContentListItemsCategory.fromJson(Map<String, dynamic> json) => _$InsightsContentListItemsCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListItemsCategoryToJson(this);
}
