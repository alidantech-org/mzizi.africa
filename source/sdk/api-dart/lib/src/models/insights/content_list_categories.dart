import 'package:json_annotation/json_annotation.dart';

part 'content_list_categories.g.dart';

/// Content List Categories
@JsonSerializable(includeIfNull: false)
class InsightsContentListCategories {
  const InsightsContentListCategories({required this.code, required this.count, required this.label});
  final String code;
  final double count;
  final String label;

  factory InsightsContentListCategories.fromJson(Map<String, dynamic> json) => _$InsightsContentListCategoriesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListCategoriesToJson(this);
}
