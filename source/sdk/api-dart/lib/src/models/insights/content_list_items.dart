import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/content_list_items_category.dart';
import 'package:mzizi_api/src/models/insights/content_list_items_classification.dart';
import 'package:mzizi_api/src/models/insights/content_list_items_front_matter.dart';
import 'package:mzizi_api/src/models/insights/content_list_items_subject.dart';

part 'content_list_items.g.dart';

/// Content List Items
@JsonSerializable(includeIfNull: false)
class InsightsContentListItems {
  const InsightsContentListItems({
    required this.body,
    required this.category,
    required this.classification,
    required this.code,
    required this.frontMatter,
    this.image,
    required this.isDevelopmentText,
    required this.language,
    required this.slug,
    required this.subject,
    required this.summary,
    required this.tags,
    required this.title,
    required this.unresolvedMedia,
  });
  final String body;
  final InsightsContentListItemsCategory category;
  final InsightsContentListItemsClassification classification;
  final String code;
  final InsightsContentListItemsFrontMatter frontMatter;
  final String? image;
  final bool isDevelopmentText;
  final String language;
  final String slug;
  final InsightsContentListItemsSubject subject;
  final String summary;
  final List<String> tags;
  final String title;
  final List<String> unresolvedMedia;

  factory InsightsContentListItems.fromJson(Map<String, dynamic> json) => _$InsightsContentListItemsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListItemsToJson(this);
}
