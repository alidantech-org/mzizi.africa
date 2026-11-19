import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_content_front_matter.g.dart';

/// Institution Detail Content Front Matter
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailContentFrontMatter {
  const InsightsInstitutionDetailContentFrontMatter({required this.image});
  final String image;

  factory InsightsInstitutionDetailContentFrontMatter.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailContentFrontMatterFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailContentFrontMatterToJson(this);
}
