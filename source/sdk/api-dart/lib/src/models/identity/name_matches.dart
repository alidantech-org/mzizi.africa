import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/name_match.dart';

part 'name_matches.g.dart';

/// Name Matches
@JsonSerializable(includeIfNull: false)
class IdentityNameMatches {
  const IdentityNameMatches({required this.matches});
  final List<IdentityNameMatch> matches;

  factory IdentityNameMatches.fromJson(Map<String, dynamic> json) => _$IdentityNameMatchesFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityNameMatchesToJson(this);
}
