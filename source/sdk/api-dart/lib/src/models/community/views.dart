import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';

part 'views.g.dart';

/// A counted view, kept for a limited time.
@JsonSerializable(includeIfNull: false)
class CommunityViews {
  const CommunityViews({
    this.articleId,
    this.countryId,
    required this.createdAt,
    required this.day,
    required this.id,
    this.identityId,
    this.postCountryId,
    this.postId,
    required this.visitorHash,
  });
  final String? articleId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime day;
  final String id;
  final String? identityId;
  final String? postCountryId;
  final String? postId;
  final String visitorHash;

  factory CommunityViews.fromJson(Map<String, dynamic> json) => _$CommunityViewsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityViewsToJson(this);
}
