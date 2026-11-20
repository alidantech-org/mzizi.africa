import 'package:json_annotation/json_annotation.dart';

part 'navigation_item.g.dart';

/// Navigation Item
@JsonSerializable(includeIfNull: false)
class ExplorerNavigationItem {
  const ExplorerNavigationItem({required this.available, required this.view});
  final bool available;
  final String view;

  factory ExplorerNavigationItem.fromJson(Map<String, dynamic> json) => _$ExplorerNavigationItemFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerNavigationItemToJson(this);
}
