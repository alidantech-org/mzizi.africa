import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/account_summary.dart';

part 'account_collection.g.dart';

/// Account Collection
@JsonSerializable(includeIfNull: false)
class AuthAccountCollection {
  const AuthAccountCollection({required this.accounts});
  final List<AuthAccountSummary> accounts;

  factory AuthAccountCollection.fromJson(Map<String, dynamic> json) => _$AuthAccountCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAccountCollectionToJson(this);
}
