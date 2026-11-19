import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/content_page_related_category.dart';
import 'package:mzizi_api/src/models/insights/content_page_related_front_matter.dart';
import 'package:mzizi_api/src/models/insights/content_page_related_subject.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content_classification.dart';

part 'content_page_related.g.dart';

/// Content Page Related
@JsonSerializable(includeIfNull: false)
class InsightsContentPageRelated {
  const InsightsContentPageRelated({
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
  final InsightsContentPageRelatedCategory category;
  final InsightsInstitutionDetailContentClassification? classification;
  final String code;
  final InsightsContentPageRelatedFrontMatter frontMatter;
  final String? image;
  final bool isDevelopmentText;
  final String language;
  final String slug;
  final InsightsContentPageRelatedSubject subject;
  final String summary;
  final List<String> tags;
  final String title;
  final List<String> unresolvedMedia;

  factory InsightsContentPageRelated.fromJson(Map<String, dynamic> json) => _$InsightsContentPageRelatedFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageRelatedToJson(this);
}
