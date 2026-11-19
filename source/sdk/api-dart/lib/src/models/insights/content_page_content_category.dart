import 'package:json_annotation/json_annotation.dart';

part 'content_page_content_category.g.dart';

/// Content Page Content Category
@JsonSerializable(includeIfNull: false)
class InsightsContentPageContentCategory {
  const InsightsContentPageContentCategory({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsContentPageContentCategory.fromJson(Map<String, dynamic> json) => _$InsightsContentPageContentCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageContentCategoryToJson(this);
}
