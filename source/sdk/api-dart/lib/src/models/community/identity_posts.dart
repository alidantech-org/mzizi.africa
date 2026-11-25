import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'identity_posts.g.dart';

/// Identity Posts
@JsonSerializable(includeIfNull: false)
class CommunityIdentityPosts {
  const CommunityIdentityPosts({required this.countryId, required this.identityId, this.limit, this.offset});
  final String countryId;
  final String identityId;
  final int? limit;
  final int? offset;

  factory CommunityIdentityPosts.fromJson(Map<String, dynamic> json) => _$CommunityIdentityPostsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityIdentityPostsToJson(this);
}
