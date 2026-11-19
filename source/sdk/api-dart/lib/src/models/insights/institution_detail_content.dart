import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content_category.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content_classification.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content_front_matter.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content_subject.dart';

part 'institution_detail_content.g.dart';

/// Institution Detail Content
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailContent {
  const InsightsInstitutionDetailContent({
    required this.body,
    required this.category,
    required this.classification,
    required this.code,
    required this.frontMatter,
    required this.image,
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
  final InsightsInstitutionDetailContentCategory category;
  final InsightsInstitutionDetailContentClassification classification;
  final String code;
  final InsightsInstitutionDetailContentFrontMatter frontMatter;
  final String image;
  final bool isDevelopmentText;
  final String language;
  final String slug;
  final InsightsInstitutionDetailContentSubject subject;
  final String summary;
  final List<String> tags;
  final String title;
  final List<String> unresolvedMedia;

  factory InsightsInstitutionDetailContent.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailContentFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailContentToJson(this);
}
