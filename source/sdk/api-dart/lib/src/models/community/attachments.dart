import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/posts.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'attachments.g.dart';

/// Media attached to a post; reviewed with the post.
@JsonSerializable(includeIfNull: false)
class CommunityAttachments {
  const CommunityAttachments({
    required this.assetId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.postCountryId,
    required this.postId,
  });
  final String assetId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String postCountryId;
  final String postId;

  factory CommunityAttachments.fromJson(Map<String, dynamic> json) => _$CommunityAttachmentsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityAttachmentsToJson(this);
}
