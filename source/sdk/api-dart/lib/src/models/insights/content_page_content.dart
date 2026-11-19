import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/content_page_content_category.dart';
import 'package:mzizi_api/src/models/insights/content_page_content_front_matter.dart';
import 'package:mzizi_api/src/models/insights/content_page_content_subject.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content_classification.dart';

part 'content_page_content.g.dart';

/// Content Page Content
@JsonSerializable(includeIfNull: false)
class InsightsContentPageContent {
  const InsightsContentPageContent({
    required this.body,
    required this.category,
    this.classification,
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
  final InsightsContentPageContentCategory category;
  final InsightsInstitutionDetailContentClassification? classification;
  final String code;
  final InsightsContentPageContentFrontMatter frontMatter;
  final String? image;
  final bool isDevelopmentText;
  final String language;
  final String slug;
  final InsightsContentPageContentSubject subject;
  final String summary;
  final List<String> tags;
  final String title;
  final List<String> unresolvedMedia;

  factory InsightsContentPageContent.fromJson(Map<String, dynamic> json) => _$InsightsContentPageContentFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageContentToJson(this);
}
