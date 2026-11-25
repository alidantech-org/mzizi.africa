import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/post_state.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/community/devices.dart';
import 'package:mzizi_api/src/models/community/proofs.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'posts.g.dart';

/// Every contribution: comments, reviews, reports and questions from signed-in members.
@JsonSerializable(includeIfNull: false)
class CommunityPosts {
  const CommunityPosts({
    required this.actorId,
    this.body,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.deviceId,
    required this.id,
    this.identityId,
    required this.kindTerm,
    this.languageId,
    this.parentId,
    this.proofId,
    this.publishedAt,
    this.rating,
    required this.state,
    required this.updatedAt,
    required this.version,
  });
  final String actorId;
  final String? body;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? deviceId;
  final String id;
  final String? identityId;
  final String kindTerm;
  final String? languageId;
  final String? parentId;
  final String? proofId;
  final DateTime? publishedAt;
  final int? rating;
  final CommunityPostState state;
  final DateTime updatedAt;
  final int version;

  factory CommunityPosts.fromJson(Map<String, dynamic> json) => _$CommunityPostsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityPostsToJson(this);
}
